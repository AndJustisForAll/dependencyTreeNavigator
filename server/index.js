const express = require("express");
const { performance } = require("perf_hooks");
const { execSync } = require("child_process");
const moment = require("moment");

const app = express();

app.get("/module/:moduleName", (req, res) => {
  const moduleName = req.params.moduleName || "";
  var dependencyTree = {
    [moduleName]: {}
  };

  performance.mark("A");
  buildDependencyTree(dependencyTree[moduleName], moduleName);
  performance.mark("B");
  performance.measure("A to B", "A", "B");
  const entries = performance.getEntriesByName("A to B") || [];
  if (entries[0]) {
    const duration = moment.duration(entries[0].duration) || {};
    console.log(`${moduleName}: duration.seconds() seconds`);
  }
  res.json(dependencyTree);
});

function buildDependencyTree(dependencyTree, moduleName, isRoot = true) {
  const dependencies = getModuleJSON(moduleName);
  for (key in dependencies) {
    dependencyTree[key] = { name: key, version: dependencies[key] };
    buildDependencyTree(dependencyTree[key], key);
  }
}

function getModuleJSON(moduleName) {
  const stdout =
    execSync(`npm view ${moduleName} dependencies --json`, {
      encoding: "utf-8"
    }) || {};

  if (Object.keys(stdout).length === 0 && stdout.constructor === Object) {
    return {};
  }
  return JSON.parse(stdout);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
