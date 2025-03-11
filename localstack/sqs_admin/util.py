import platform
import logging

LOG = logging.getLogger(__name__)

def get_system():
    system = platform.system().lower()
    machine = platform.machine().lower()

    arch_mapping = {
        'x86_64': 'amd64',
        'amd64': 'amd64',
        'arm64': 'arm64',
        'aarch64': 'arm64',
    }

    system_mapping = {
        'darwin': 'darwin',
        'linux': 'linux',
    }

    std_system = system_mapping.get(system, system)
    std_arch = arch_mapping.get(machine, machine)

    platform_dir = f"{std_system}-{std_arch}"

    LOG.debug(f"Detected platform: {platform_dir}")

    return platform_dir