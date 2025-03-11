import logging
import os
import subprocess
import threading
import typing as t
from localstack.extensions.patterns.webapp import WebAppExtension

from .app import App
from .util import get_system

LOG = logging.getLogger(__name__)

class SqsAdmin(WebAppExtension):
    name = "sqs-admin"

    def __init__(self):
        super().__init__(template_package_path=None)
        self.port = 3999
        self.process = None
        self.bin_dir = None
        self.binary_path = None
        self.stopped = False

    def _init_paths(self):
        """Init required paths"""
        binary_name = "sqs-admin"
        self.bin_dir = os.path.join(os.path.dirname(__file__), "bin")
        self.binary_path = os.path.join(self.bin_dir, get_system(), binary_name)

    def _init_environment(self):
        """Init required environment variables"""
        env = os.environ.copy()
        env["SQS_ENDPOINT_URL"] = "http://localhost:4566"
        env["SQS_ADMIN_STATIC_DIR"] = os.path.join(self.bin_dir, "dist")
        env["HTTP_PORT"] = str(self.port)
        return env

    def on_platform_start(self):
        try:
            self._init_paths()
            env = self._init_environment()

            LOG.debug(f"Starting SQS Admin on port {self.port}")

            # Start the SQS Admin process
            self.process = subprocess.Popen(
                [self.binary_path],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            # Start a thread to read and log output
            def read_output():
                while not self.stopped:
                    if self.process.poll() is not None:
                        # Process has terminated
                        break

                    line = self.process.stdout.readline()
                    if line:
                        LOG.debug(f"SQS Admin: {line.decode('utf-8').strip()}")

            threading.Thread(target=read_output, daemon=True).start()
            LOG.debug("SQS Admin extension started successfully")
        except Exception as e:
            LOG.error(f"Failed to start SQS Admin extension: {e}")

    def on_platform_ready(self):
        LOG.info("SQS Admin extension is ready")

    def on_platform_shutdown(self):
        LOG.debug("Shutting down SQS Admin extension")
        self.stopped = True
        self.process.terminate() if self.process else None

    def collect_routes(self, routes: list[t.Any]):
        LOG.debug("Collecting extension routes")
        routes.append(App(port=self.port))