socialModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/VAdminContactos/:idUsuario', {
                controller: 'VAdminContactosController',
                templateUrl: 'app/chat/VAdminContactos.html'
            }).when('/VChat/:idChat', {
                controller: 'VChatController',
                templateUrl: 'app/chat/VChat.html'
            }).when('/VContactos/:idUsuario', {
                controller: 'VContactosController',
                templateUrl: 'app/chat/VContactos.html'
            }).when('/VGrupo/:idGrupo', {
                controller: 'VGrupoController',
                templateUrl: 'app/chat/VGrupo.html'
            });
}]);

socialModule.controller('VAdminContactosController',
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', '$routeParams', 'ngDialog', 'ngTableParams', 'chatService', 'identService',
    function ($scope, navegador, $location, $route, $timeout, flash, $routeParams, ngDialog, ngTableParams, chatService, identService) {
      $scope.msg = '';
      $scope.fContacto = {};

      chatService.VAdminContactos({"idUsuario":$routeParams.idUsuario}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }

              var AElimContacto1Data = $scope.res.data1;
              if(typeof AElimContacto1Data === 'undefined') AElimContacto1Data=[];
              $scope.tableParams1 = new ngTableParams({
                  page: 1,            // show first page
                  count: 10           // count per page
              }, {
                  total: AElimContacto1Data.length, // length of data
                  getData: function($defer, params) {
                      $defer.resolve(AElimContacto1Data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });

              var VGrupo2Data = $scope.res.data2;
              if(typeof VGrupo2Data === 'undefined') VGrupo2Data=[];
              $scope.tableParams2 = new ngTableParams({
                  page: 1,            // show first page
                  count: 10           // count per page
              }, {
                  total: VGrupo2Data.length, // length of data
                  getData: function($defer, params) {
                      $defer.resolve(VGrupo2Data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });

      });

     navegador.agregarBotones($scope);

      $scope.AgregGrupo4 = function(idUsuario) {

        chatService.AgregGrupo({"idUsuario":((typeof idUsuario === 'object')?JSON.stringify(idUsuario):idUsuario)}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          $location.path(label);
          $route.reload();
        });};

      $scope.fContactoSubmitted = false;
      $scope.AgregContacto3 = function(isValid) {
        $scope.fContactoSubmitted = true;
        if (isValid) {

          chatService.AgregContacto($scope.fContacto).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
          });
        }
      };
      
      $scope.AgregarContactoQuery = function(nombre){
        
        var parametro_post = {'nombre':nombre};
        
        chatService.AgregContacto(parametro_post).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
        });
      };
      
      
      $scope.AElimContacto1 = function(id) {
          var tableFields = [["idContacto","id"],["nombre","Nombre"],["tipo","Tipo"]];
          var arg = {};
          arg[tableFields[0][1]] = ((typeof id === 'object')?JSON.stringify(id):id);
          if (confirm("Se eliminará el usuario "+"\'"+id+"\'") == true){
            chatService.AElimContacto(arg).then(function (object) {
                var msg = object.data["msg"];
                if (msg) flash(msg);
                var label = object.data["label"];
                $location.path(label);
                $route.reload();   
          })};
      };
      $scope.VGrupo2 = function(idGrupo) {
        $location.path('/VGrupo/'+((typeof idGrupo === 'object')?JSON.stringify(idGrupo):idGrupo));
      };

      $scope.__ayuda = function() {
      ngDialog.open({ template: 'ayuda_VAdminContactos.html',
              showClose: true, closeByDocument: true, closeByEscape: true});
      }
          }]);
          
socialModule.controller('VGrupoController',
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', '$routeParams', 'ngDialog', 'ngTableParams', 'chatService', 'identService',
    function ($scope, navegador, $location, $route, $timeout, flash, $routeParams, ngDialog, ngTableParams, chatService, identService) {
      $scope.msg = '';
      $scope.fMiembro = {};

      chatService.VGrupo({"idGrupo":$routeParams.idGrupo}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }

              var AElimMiembro3Data = $scope.res.data3;
              if(typeof AElimMiembro3Data === 'undefined') AElimMiembro3Data=[];
              $scope.tableParams3 = new ngTableParams({
                  page: 1,            // show first page
                  count: 10           // count per page
              }, {
                  total: AElimMiembro3Data.length, // length of data
                  getData: function($defer, params) {
                      $defer.resolve(AElimMiembro3Data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });


      });
      $scope.ASalirGrupo1 = function() {

        chatService.ASalirGrupo().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          $location.path(label);
          $route.reload();
        });};
      $scope.VAdminContactos2 = function(idUsuario) {
        $location.path('/VAdminContactos/'+idUsuario);
      };

    navegador.agregarBotones($scope);

      $scope.fMiembroSubmitted = false;
      $scope.AgregMiembro0 = function(isValid) {
        $scope.fMiembroSubmitted = true;
        if (isValid) {

          chatService.AgregMiembro($scope.fMiembro).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
          });
        }
      };

      $scope.AElimMiembro3 = function(id) {
          var tableFields = [["idContacto","id"],["nombre","Nombre"]];
          var arg = {};
          arg[tableFields[0][1]] = ((typeof id === 'object')?JSON.stringify(id):id);
          if (confirm("Se eliminará el miembro "+"\'"+id+"\'") == true){
            chatService.AElimMiembro(arg).then(function (object) {
                var msg = object.data["msg"];
                if (msg) flash(msg);
                var label = object.data["label"];
                $location.path(label);
                $route.reload();
          })};
      };
      
       $scope.AgregarContactoQuery = function(nombre){
        
        var parametro_post = {'nombre':nombre};
        
        chatService.AgregMiembro(parametro_post).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
        });
      };
      

$scope.__ayuda = function() {
ngDialog.open({ template: 'ayuda_VGrupo.html',
        showClose: true, closeByDocument: true, closeByEscape: true});
}
    }]);
