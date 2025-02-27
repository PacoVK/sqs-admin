import requests
import logging
from localstack.http import route, Response, Request

LOG = logging.getLogger(__name__)

class App:

    def __init__(self, port: int):
        self.proxies = {"http": f"http://localhost:{port}"}

    @route("/")
    def index(self, request: Request):
        response = requests.get(
            request.url,
            proxies=self.proxies
        )
        res = Response(response)
        res.headers = response.headers
        return res

    @route("/<path:anything>")
    def assets(self, request: Request, anything):
        LOG.debug("Try to access %s", request.base_url)
        response = requests.request(
            request.method,
            request.url,
            data=request.data,
            proxies=self.proxies
        )
        res = Response(response)
        res.headers = response.headers
        return res