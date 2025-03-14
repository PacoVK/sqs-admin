import requests
import logging
from localstack.http import route, Response, Request

LOG = logging.getLogger(__name__)

class App:

    def __init__(self, port: int):
        self.proxies = {"http": f"http://localhost:{port}"}

    @route("/")
    def index(self, request: Request):
        url = request.base_url.replace("_extension/sqs-admin/","")
        response = requests.get(
            url,
            proxies=self.proxies
        )
        res = Response(response)
        res.headers = response.headers
        return res

    @route("/<path:anything>")
    def assets(self, request: Request, anything):
        LOG.debug("Try to access %s", request.base_url)
        url = request.base_url.replace("_extension/sqs-admin/","")
        response = requests.request(
            request.method,
            url,
            data=request.data,
            proxies=self.proxies
        )
        res = Response(response)
        res.headers = response.headers
        return res