// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require angular
//= require angular-resource
//= require angular-rails-templates
//= require_tree ../templates

"use strict";

// Note: function wrapped in an IFEE (Immediately Invoked Function Expression)
(function() {

  angular
    .module("wdinstagram", [
      "ui.router",
      "ngResource",
      "templates"
    ])
    .config([
      "$stateProvider",
      "$locationProvider",
      RouterFunction
    ])
    .factory("InstaFactory", [
      "$resource",
      InstaFactoryFunction
    ])
    .controller("InstaIndexController", [
      "InstaFactory",
      InstaIndexControllerFunction
    ])
    .controller("InstaNewController", [
      "InstaFactory",
      "$state",
      InstaNewControllerFunction
    ])
    .controller("InstaShowController", [
      "InstaFactory",
      "$stateParams",
      "$state",
      InstaShowControllerFunction
    ])
    .controller("InstaEditController", [
      "InstaFactory",
      "$stateParams",
      "$state",
      InstaEditControllerFunction
    ]);



  // Factory Function
  function InstaFactoryFunction($resource) {
    return $resource("https://wdinstagram-api.herokuapp.com/entries/:id", {}, {
      update: { method: "PUT" },
      destroy: { method: "DELETE" }
    })
  }



  // Controller Functions
  function InstaIndexControllerFunction(InstaFactory) {
    this.posts = InstaFactory.query()
  }

  function InstaNewControllerFunction(InstaFactory, $state) {
    this.post = new InstaFactory()
    this.create = function() {
      this.post.$save().then(function(post) {
        $state.go("instaShow", {id: post.id})
      })
    }
  }

  function InstaShowControllerFunction(InstaFactory, $stateParams, $state) {
    this.post = InstaFactory.get({id: $stateParams.id})
    // Delete function for posts
    this.destroy = function() {
      this.post.$delete({id: $stateParams.id}).then(function() {
        $state.go("instaIndex")
      })
    }
  }

  function InstaEditControllerFunction(InstaFactory, $stateParams, $state) {
    this.post = InstaFactory.get({id: $stateParams.id})
    this.update = function() {
      this.post.$update({id: $stateParams.id}).then(function(post) {
        $state.go("instaShow", {id: post.id})
      })
    }
  }



  // Router
  function RouterFunction($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $stateProvider
    .state("instaIndex", {
      url: "/",
      templateUrl: "ng-views/index.html",
      controller: "InstaIndexController",
      controllerAs: "vm"
    })
    .state("instaNew", {
      url: "/new",
      templateUrl: "ng-views/new.html",
      controller: "InstaNewController",
      controllerAs: "vm"
    })
    .state("instaShow", {
      url: "/:id",
      templateUrl: "ng-views/show.html",
      controller: "InstaShowController",
      controllerAs: "vm"
    })
    .state("instaEdit", {
      url: "/:id/edit",
      templateUrl: "ng-views/edit.html",
      controller: "InstaEditController",
      controllerAs: "vm"
    })
  };

})(); // close IFEE
