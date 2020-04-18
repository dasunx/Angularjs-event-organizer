"use strict";
/*jshint esversion: 6 */


app.controller('AppCtrl',['$scope', '$location', '$anchorScroll','$filter',function($scope,$location,$anchorScroll,$filter) {
    let id;
    if (localStorage.getItem('uid') !=null){
        id = localStorage.getItem('uid');
    }else {
        id = 1;
    }
    this.validateError=[{eName:false,eSDate:false,eEDate:false,eSTime:false,eETime:false}];
    this.counter = 0;
    this.startDate = new Date();
    this.IsVisible = false;
    this.IsEditVisible = false;
    this.evList =[];
    if (localStorage.getItem('sav') != null){
        this.evList = JSON.parse(localStorage['sav']);
    }
    this.editID = 1;
    this.editevList=[];
    $scope.dated = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.cards= 4;
    $scope.today = $filter('date')(new Date(),'yyyy-MM-dd');
    let saved = [];
    $scope.IsTodayPosts = true;


    this.ShowHide = function(param){
        this.IsVisible = param;
        if(this.IsVisible == true){

            this.ShowHideEdit(false);
            this.goto('evx');
        }else{
            this.goto('home');
        }
    };

    this.ShowHideEdit = function(param){
        this.IsEditVisible = param;
        if(this.IsEditVisible == true){
            this.ShowHide(false);
            this.goto('edit-evx');
        }else{
            this.goto('home');
        }
    };

    this.goto= function(param){
        $location.hash(param);
        $anchorScroll();
    };

    this.update = function (ev) {
        if(this.validateform(ev)){
            let bool;
            let edatex = $filter('date')(ev.edate, 'yyyy-MM-dd');
            if(edatex <= $scope.today){
                bool = true;
            }else {
                bool = false;
            }
            this.alerror = "";
            this.eventse = angular.copy(ev);
            this.evList.push({id:id,eventName:ev.name,eventDes:ev.descript,eventsDate:($filter('date')(ev.sdate, 'yyyy-MM-dd')),eventeDate:($filter('date')(ev.edate, 'yyyy-MM-dd')),eventStime:ev.stime,eventEtime:ev.etime,complete:bool});
            id++;
            localStorage.setItem('uid',id);
            saved = this.evList;
            let d = JSON.stringify(saved);
            localStorage.setItem('sav',d);
            ev.name= null;
            ev.descript= null;
            ev.stime= null;
            ev.etime = null;
            ev.sdate = null;
            ev.edate = null;
            this.ShowHide(false);
        }

    };

    this.editData = function (editev) {
        if(this.validateform(editev)){
            let objIndex = this.evList.findIndex((obj=>obj.id == this.editID));
            this.editevList.push(this.evList[objIndex]);
            this.evList[objIndex].eventName = editev.name;
            this.evList[objIndex].eventDes= editev.descript;
            this.evList[objIndex].eventsDate = $filter('date')(editev.sdate,'yyyy-MM-dd');
            this.evList[objIndex].eventeDate = editev.edate;
            this.evList[objIndex].eventStime = editev.stime;
            this.evList[objIndex].eventEtime = editev.etime;
            saved = this.evList;
            let d = JSON.stringify(saved);
            localStorage.setItem('sav',d);
            this.ShowHideEdit(false);
        }
    };

    this.loadData = function (editev) {
        let objIndex = this.evList.findIndex((obj=>obj.id == this.editID));
        editev.name = this.evList[objIndex].eventName;
        editev.descript = this.evList[objIndex].eventDes ;
        editev.sdate = this.evList[objIndex].eventsDate;
        editev.edate =this.evList[objIndex].eventeDate;
        editev.stime =$filter('date')(this.evList[objIndex].eventStime, 'hh:mm');
        editev.etime = this.evList[objIndex].eventEtime ;
    };

    this.edit = function (id) {
        this.editID = id;
        let objIndex = this.evList.findIndex((obj=>obj.id == this.editID));
        this.editevList[0]= (this.evList[objIndex]);
        this.ShowHideEdit(true);
    };


    this.validateform = function(ev){
        if(ev.name != null){
            this.validateError.eName = false;
        }if(ev.sdate != null ){
            this.validateError.eSDate = false;
        }if(ev.edate != null ){
            this.validateError.eEDate = false;
        }if(ev.stime!= null){
            this.validateError.eSTime= false;
        }if(ev.etime!= null){
            this.validateError.eETime= false;
        }
        if(ev.name == null){
            this.validateError.eName = true;
        }else if(ev.sdate == null ){
            this.validateError.eSDate = true;
        }else if(ev.edate == null ){
            this.validateError.eEDate = true;
        }else if(ev.stime== null){
            this.validateError.eSTime= true;
        }else if(ev.etime== null){
            this.validateError.eETime= true;
        }else{
            return true;
        }
        return false;
    };

    this.changeDate = function () {
       $scope.dated =  $filter('date')(this.startDate, 'yyyy-MM-dd');
       this.todayPostCount();
    };

    this.delete = function(id){
        let objIndex = this.evList.findIndex((obj=>obj.id == this.editID));
        this.evList.splice(objIndex,1);
        saved = this.evList;
        let d = JSON.stringify(saved);
        localStorage.setItem('sav',d);
        alert( "Has been deleted successfully.");
    };

    this.todayPostCount = function(){
        let objIndex = this.evList.findIndex((obj=>obj.eventsDate == $scope.dated));
        let e = this.evList.findIndex((obj=>obj.eventeDate == $scope.dated));
        console.log($scope.dated + " obj" + objIndex + " e " + e );
        if(objIndex != -1 || e != -1){
            $scope.IsTodayPosts = true;
            return true;
        }else{
            $scope.IsTodayPosts = false;
            return false;
        }
    }
    $scope.seeMore = function () {
        $scope.cards = $scope.cards + 2;
    };



}]);

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure you need to delete this?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])