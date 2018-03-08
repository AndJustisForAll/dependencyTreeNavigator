angular.module("core.dependencies").factory("Dependencies", [
  "$resource",
  $resource => {
    return $resource(
      "/mock",
      {},
      {
        get: { method: "GET" }
      }
    );
  }
]);
