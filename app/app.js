'use strict';

let app;
app = angular.module('ToDoList', ['ngMaterial','ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "main.html"
        })
        .when("/completed", {
            templateUrl : "completed.html"
        })
        .when("/about", {
            templateUrl : "about.html"
        });
});