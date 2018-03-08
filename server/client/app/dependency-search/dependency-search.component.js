angular.module("dependencySearch").component("dependencySearch", {
  controller: [
    "Dependencies",
    function DependencySearchController(Dependencies) {
      this.query = "";
      this.npmModule = "";
        this.data = [10,20,30,40,60];

      this.search = () => {
        Dependencies.get().$promise.then(data => {
          this.npmModule = data.toJSON();
        });
      };
    }
  ],
  templateUrl: "dependency-search/dependency-search.template.html"
});
