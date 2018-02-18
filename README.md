# Cesium Satellites Viewer
## View the orbit of satellites in a Cesium, derived from a two line element list

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

![Screenshot 1](https://i.imgur.com/NJkNOiT.png)

## How to run locally

```bash
git clone https://github.com/KhaledSharif/cesium-satellites.git
cd cesium-satellites
docker build -t cesium:satellites .
docker run -d -p 8080:80 cesium:satellites
```