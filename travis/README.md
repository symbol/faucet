# Travis Functions

A recollection of bash files that can be used when configuring CI/CD with travis.

- `travis-functions.sh` base line of functions. 
- `node-functions.sh` for node projects that require npm deployments and releases.
- `docker-functions.sh` for projects that generate and pushes docker images. 

These functions can be called from your Travis file (`.travis.yml`) to perform the different operations. 

To use the bash files, you can either copy them into your ./travis project folder or use a git submodule. 

In your project:

````
git submodule add https://github.com/nemgrouplimited/travis-functions.git travis
````

Examples:

- [symbol-sdk-java](https://github.com/nemtech/symbol-sdk-java): gradle library project.
- [symbol-sdk-typescript-javascript](https://github.com/nemtech/symbol-sdk-typescript-javascript): node and npm library project.
- [symbol-bootstrap](https://github.com/nemtech/catbuffer-generators): node and npm library project.
- [symbol-faucet](https://github.com/nemgrouplimited/symbol-faucet): node project that deploys docker images.
- [catapult-rest](https://github.com/nemtech/catbuffer-generators): node project that deploys docker images.
- [catbuffer-generators](https://github.com/nemtech/catbuffer-generators): multi-language generation, deployment and releases
- [symbol-openapi-generator](https://github.com/nemtech/symbol-openapi-generator): multi-language generation, deployment and releases
