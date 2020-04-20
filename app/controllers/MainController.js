"use strict";
/*jshint esversion: 6 */
/*jshint browser: true */


app.controller('AppCtrl',['$scope', '$location', '$anchorScroll','$filter',function($scope,$location,$anchorScroll,$filter) {
    let id;
    let called = 1;
    let recent;
    if (localStorage.getItem('uid') !=null){
        id = localStorage.getItem('uid');
    }else {
        id = 1;
    }
    this.validateError=[{eName:false,eSDate:false,eSTime:false,eETime:false,eTimeLarge:false}];
    this.counter = 0;
    this.startDate = new Date();
    this.IsVisible = false;
    this.IsEditVisible = false;
    $scope.evList =[];
    if (localStorage.getItem('sav') != null){
        $scope.evList = JSON.parse(localStorage['sav']);
        for (let v in $scope.evList){
            console.log($scope.evList[v]);
            if($scope.evList[v].complete == false){
                let objIndex = $scope.evList.findIndex((obj=>obj.id == $scope.evList[v].id));
                let r = checkComplete($scope.evList[v].id);
                if(r.day < 0 ){
                    $scope.evList[objIndex].complete = true;

                }else if(r.day == 0 && r.hour == 0 && r.min ==0 && r.sec == 0){
                    $scope.evList[objIndex].complete = true;

                }
            }
        }
    }
    $scope.ev = [];
    $scope.ev.stime = new Date();
    $scope.ev.etime = new Date();
    $scope.editev=[];
    this.editID = 1;
    this.editevList=[];
    $scope.dated = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.cards= 4;
    this.today = new Date();
    let saved = [];
    $scope.updateString = 1;
    $scope.IsTodayPosts = true;

    $scope.changeEvTime = function (ev) {
      ev.stime = new Date(ev.sdate);
      ev.etime = new Date(ev.sdate);

    };
    $scope.changeEvEditTime = function (ev) {
        ev.stime = new Date(ev.sdate);
        ev.etime = new Date(ev.sdate);

    };
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
            this.eventse = angular.copy(ev);

            $scope.evList.push({id:id,eventName:ev.name,eventDes:ev.descript,eventsDate:($filter('date')(ev.sdate, 'yyyy-MM-dd')),eventStime:new Date(ev.stime),eventEtime:new Date(ev.etime),complete:false});
            let r = checkComplete(id);
            let objIndex = $scope.evList.findIndex((obj=>obj.id == id));
            if(r.day < 0 ){
                $scope.evList[objIndex].complete = true;
                location.reload();
            }else if(r.day == 0 && r.hour == 0 && r.min ==0 && r.sec == 0){
                $scope.evList[objIndex].complete = true;
                location.reload();
            }
            id++;
            localStorage.setItem('uid',id);
            saved = $scope.evList;
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
            let objIndex = $scope.evList.findIndex((obj=>obj.id == this.editID));
            this.editevList.push($scope.evList[objIndex]);
            $scope.evList[objIndex].eventName = editev.name;
            $scope.evList[objIndex].eventDes= editev.descript;
            $scope.evList[objIndex].eventsDate = $filter('date')(editev.sdate,'yyyy-MM-dd');
            $scope.evList[objIndex].eventStime = new Date(editev.stime);
            $scope.evList[objIndex].eventEtime = new Date(editev.etime);
            let r = checkComplete(this.editID);
            if(r.day < 0 ){
                $scope.evList[objIndex].complete = true;
                location.reload();
            }else if(r.day == 0 && r.hour == 0 && r.min ==0 && r.sec == 0){
                $scope.evList[objIndex].complete = true;
                location.reload();
            }
            saved = $scope.evList;
            let d = JSON.stringify(saved);
            localStorage.setItem('sav',d);
            this.ShowHideEdit(false);

        }
    };

    this.loadData = function (id) {
        let objIndex = $scope.evList.findIndex((obj=>obj.id == id));
        $scope.editev.name = $scope.evList[objIndex].eventName;
        $scope.editev.descript = $scope.evList[objIndex].eventDes ;
        $scope.editev.sdate = $scope.evList[objIndex].eventsDate;
        $scope.editev.stime = new Date($scope.evList[objIndex].eventsDate);
        $scope.editev.etime =new Date($scope.evList[objIndex].eventsDate);

    };

    this.edit = function (id) {
        this.loadData(id);
        this.editID = id;
        let objIndex = $scope.evList.findIndex((obj=>obj.id == this.editID));
        this.editevList[0]= ($scope.evList[objIndex]);
        this.ShowHideEdit(true);
    };


    this.validateform = function(ev){
        if(ev.name != null){
            this.validateError.eName = false;
        }if(ev.sdate != null ){
            this.validateError.eSDate = false;
        }if(ev.stime!= null){
            this.validateError.eSTime= false;
        }if(ev.etime!= null){
            this.validateError.eETime= false;
        }
        if(ev.name == null){
            this.validateError.eName = true;
        }else if(ev.sdate == null ){
            this.validateError.eSDate = true;
        }else if(ev.stime== null){
            this.validateError.eSTime= true;
        }else if(ev.etime== null){
            this.validateError.eETime= true;
        }else if(ev.etime<ev.stime){
            this.validateError.eTimeLarge = true;
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
        let objIndex = $scope.evList.findIndex((obj=>obj.id == id));
        $scope.evList.splice(objIndex,1);
        saved = $scope.evList;
        let d = JSON.stringify(saved);
        localStorage.setItem('sav',d);
        alert( "Event Has been deleted successfully.");
    };

    this.todayPostCount = function(){
        let objIndex = $scope.evList.findIndex((obj=>obj.eventsDate == $scope.dated));
        let e = $scope.evList.findIndex((obj=>obj.eventeDate == $scope.dated));
        if(objIndex != -1 || e != -1){
            $scope.IsTodayPosts = true;
            return true;
        }else{
            $scope.IsTodayPosts = false;
            return false;
        }
    };
    $scope.seeMore = function () {
        $scope.cards = $scope.cards + 2;
    };

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.intervCal = function (id) {
        if(called==1){
            $scope.interve(id);
            called++;
        }
    };

    $scope.interve = function (id) {
        let x = setInterval(function () {
            let r = checkComplete(id);
            document.getElementById('timeremaining').innerHTML = r.day + " days " + r.hour+ " hour " + r.min+ " mins " + r.sec + " seconds";
            if(r.day == 0 && r.hour== 0 && r.min==0 && r.sec == 2){
                clearInterval(x);
                $scope.c(id);
            }
        },1000);
    };

    function checkComplete(id){
        let objIndex = $scope.evList.findIndex((obj=>obj.id == id));
        let sdate = new Date($scope.evList[objIndex].eventsDate);
        let end = new Date($scope.evList[objIndex].eventEtime);
        let now = new Date();

        let ret = [{day:0,hour:0,min:0,sec:0}];
        let millie = (end-now);
        let d = Math.floor((millie)/1000/60/60/24);
        millie -= d * 1000 * 60 * 60 * 24;
        let h = Math.floor(millie/1000/60/60);
        millie -= h * 1000 * 60 * 60;
        let m = Math.floor(millie / 1000 / 60);
        millie -= m * 1000 * 60;
        let s = Math.floor(millie / 1000);
        millie -= s * 1000;
        ret.day =d;
        ret.hour = h;
        ret.min = m;
        ret.sec = s;

        return ret;
    };


    $scope.c = function (id) {
        let objIndex = $scope.evList.findIndex((obj=>obj.id == id));
        $scope.evList[objIndex].complete = true;
        saved = $scope.evList;
        let d = JSON.stringify(saved);
        localStorage.setItem('sav',d);

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
                        scope.$eval(clickAction);
                    }
                });
            }
        };
}]);

