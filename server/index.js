const express = require("express");
const { performance } = require("perf_hooks");
const { execSync } = require("child_process");
const moment = require("moment");
const mockResponse = require("./mockResponse");

const app = express();

app.get("/module/:moduleName", (req, res) => {
  const moduleName = req.params.moduleName || "";
  const rootModuleJSON = getModuleJSON(moduleName);
  var dependencyTree = {
    [moduleName]: rootModuleJSON
  };

  performance.mark("A");
  buildDependencyTree(dependencyTree[moduleName]);
  performance.mark("B");
  performance.measure("A to B", "A", "B");
  const entries = performance.getEntriesByName("A to B") || [];
  if (entries[0]) {
    const duration = moment.duration(entries[0].duration) || {};
    console.log(`${moduleName}: ${duration.seconds()} seconds`);
  }
  res.json(dependencyTree);
});

//Mock
app.get("/mock/", (req, res) => {
  res.json(mockResponse);
});

function buildDependencyTree(dependencyTree) {
  const dependencies = dependencyTree.dependencies;
  for (key in dependencies) {
    const moduleJSON = getModuleJSON(key);
    dependencies[key] = moduleJSON;
    buildDependencyTree(dependencies[key]);
  }
}

function getModuleJSON(moduleName) {
  const stdout =
    execSync(`npm view ${moduleName} --json`, {
      encoding: "utf-8"
    }) || {};

  if (Object.keys(stdout).length === 0 && stdout.constructor === Object) {
    return {};
  }
  const moduleJSON = JSON.parse(stdout);
  return {
    name: moduleJSON.name,
    author: moduleJSON.author,
    dependencies: moduleJSON.dependencies,
    description: moduleJSON.description,
    version: moduleJSON.version
  };
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
