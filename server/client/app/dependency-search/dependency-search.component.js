angular.module("dependencySearch").component("dependencySearch", {
  controller: [
    "$http",
    function DependencySearchController($http) {
      this.query = "angular-js";
      console.log(this.query);
      $http.get("/mock").then(res => {
        this.query = res.data;
      });
    }
  ],
  templateUrl: "dependency-search/dependency-search.template.html"
});
