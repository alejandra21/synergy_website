socialModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/VLogin', {
                controller: 'VLoginController',
                templateUrl: 'app/ident/VLogin.html'
            }).when('/', {
                controller: 'VInicioController',
                templateUrl: 'app/ident/VInicio.html'
            }).when('/VPrincipal', {
                controller: 'VPrincipalController',
                templateUrl: 'app/ident/VPrincipal.html'
            }).when('/VPrincipal', {
                controller: 'VPrincipalController',
                templateUrl: 'app/ident/VPrincipal.html'
            }).when('/VRegistro', {
                controller: 'VRegistroController',
                templateUrl: 'app/ident/VRegistro.html'
            }).when('/VPrincipal/:idPagina', {
                controller: 'VSecundariaController',
                templateUrl: 'app/ident/VSecundaria.html'
            });
}]);

socialModule.controller('VInicioController', 
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', 'chatService', 'identService', 'paginasService',
    function ($scope, navegador, $location, $route, $timeout, flash, chatService, identService, paginasService) {

      identService.VInicio().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }

      });

      navegador.agregarBotones($scope);

}]);

socialModule.controller('VLoginController', 
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', 'chatService', 'identService', 'paginasService',
    function ($scope, navegador, $location, $route, $timeout, flash, chatService, identService, paginasService) {
      $scope.msg = '';
      $scope.fLogin = {};

      identService.VLogin().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }

      });

      navegador.agregarBotones($scope);

      $scope.reloadRoute = function() {
         $route.reload();
      }

      $scope.fLoginSubmitted = false;
      $scope.AIdentificar0 = function(isValid) {
        $scope.fLoginSubmitted = true;
        if (isValid) {
          
          identService.AIdentificar($scope.fLogin).then(function (object) {
              var msg = object.data["msg"];
              if (msg) {
                  flash(msg);
                  alert(msg);
              }
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
          });
        }
      };

    }]);

socialModule.controller('VPrincipalController', 
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', 'chatService', 'identService', 'paginasService', 'foroService', 'ngDialog',
    function ($scope, navegador, $location, $route, $timeout, flash, chatService, identService, paginasService, foroService, ngDialog) {
      $scope.msg = '';
      $scope.principal = 'principal';
      identService.VPrincipal().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
    });

     navegador.agregarBotones($scope);
      $scope.APagina1 = function(idPagina) {
        paginasService.APagina({"idPagina":((typeof idPagina === 'object')?JSON.stringify(idPagina):idPagina)}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          $location.path(label);
          $route.reload();
        });};

      $scope.VSecundaria = function(idPagina){    
          $location.path('/VPrincipal/' + idPagina)
      };
      var cargarComentarios = function() {
          foroService.VHilos({'idHilo': $scope.pag.hilo}).then(function (object){
              $scope.publicacion = object.data.publicacion
              $scope.fpublicacion = {titulo: object.data.tituloNuevaPublicacion}
              $scope.comentarios = true;
              $scope.fpublicacionFormSubmitted = false
              $scope.error = false
          });
      };
      $scope.mostrarComentarios = function (){
          if ($scope.pag.hilo == -1)
            return;
          cargarComentarios();
      };
      
      var agregarPublicacion = function(scope, isValid, idPublicacion) {
        if (scope.fpublicacionFormSubmitted)
            return;
        scope.fpublicacionFormSubmitted = true;
        if (isValid) {
          args = {}
          args['id'] = idPublicacion;
          args['titulo'] = "Comentario-de-pagina";
          args['contenido'] = scope.fpublicacion.texto;
          foroService.AgregPublicacion(args).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              ngDialog.closeAll();
              cargarComentarios();
          });
      } else {
          scope.error = true;
          scope.fpublicacionFormSubmitted = false;
      } 
      };
      
      $scope.AgregPublicacion3 = function(isValid, id) {
          agregarPublicacion($scope, isValid, id);
      };
      
      $scope.responderPublicacion = function(publicacion) {
          var nuevoScope = $scope.$new(true);
          nuevoScope.publicacion = publicacion;
          nuevoScope.fpublicacion = {titulo: "RE: " + publicacion.titulo};
          nuevoScope.fpublicacionFormSubmitted = false;
          nuevoScope.idUsuario = true;
          nuevoScope.AgregPublicacion3 = function(isValid, id) {
              agregarPublicacion(nuevoScope, isValid, id);
          };
          ngDialog.open({ template: 'responder_Publicacion.html',
          showClose: true, closeByDocument: true, closeByEscape: true,
          scope: nuevoScope
          });
      };
      
      $scope.colapsar = function (id) {
          var element = document.getElementById('publicacion' + id);
          var boton = document.getElementById('boton' + id);
          if (element.style.display == 'none') {
              element.style.display = 'initial';
              boton.innerHTML = "<span id='up' class='glyphicon glyphicon-chevron-up'></span>";
          } else {
              element.style.display = 'none';
              boton.innerHTML = "<span id='up' class='glyphicon glyphicon-chevron-down'></span>";
          }
      };
      
      $scope.AElimPublicacion1 = function(idPublicacion) {
        //var tableFields = [["idForo","id"],["titulo","Titulo"],["fecha","Fipo"]];
        var arg = {};
        //arg[tableFields[0][1]] = ((typeof id === 'object')?JSON.stringify(id):id);
        arg['idPublicacion'] = ((typeof id === 'object')?JSON.stringify(idPublicacion):idPublicacion);
        foroService.AElimPublicacion(arg).then(function (object) {
            var msg = object.data["msg"];
            if (msg) flash(msg);
            cargarComentarios()
        });
    };
    }]);
    
socialModule.controller('VSecundariaController', 
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', '$routeParams', 'chatService', 'identService', 'paginasService', 'foroService', 'ngDialog',
    function ($scope, navegador, $location, $route, $timeout, flash, $routeParams, chatService, identService, paginasService, foroService, ngDialog) {
      $scope.msg = '';
      $scope.comentarios = false;
      identService.VSecundaria({"idPagina":$routeParams.idPagina}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }

      });
     
      navegador.agregarBotones($scope);
      
      var cargarComentarios = function() {
          foroService.VHilos({'idHilo': $scope.pag.hilo}).then(function (object){
              $scope.publicacion = object.data.publicacion
              $scope.fpublicacion = {titulo: object.data.tituloNuevaPublicacion}
              $scope.comentarios = true;
              $scope.fpublicacionFormSubmitted = false
              $scope.error = false
          });
      };
      $scope.mostrarComentarios = function (){
          if ($scope.pag.hilo == -1)
            return;
          cargarComentarios();
      };
      
      var agregarPublicacion = function(scope, isValid, idPublicacion) {
        if (scope.fpublicacionFormSubmitted)
            return;
        scope.fpublicacionFormSubmitted = true;
        if (isValid) {
          args = {}
          args['id'] = idPublicacion;
          args['titulo'] = "Comentario-de-pagina";
          args['contenido'] = scope.fpublicacion.texto;
          foroService.AgregPublicacion(args).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              ngDialog.closeAll();
              cargarComentarios();
          });
      } else {
          scope.error = true;
          scope.fpublicacionFormSubmitted = false;
      } 
      };
      
      $scope.AgregPublicacion3 = function(isValid, id) {
          agregarPublicacion($scope, isValid, id);
      };
      
      $scope.responderPublicacion = function(publicacion) {
          var nuevoScope = $scope.$new(true);
          nuevoScope.publicacion = publicacion;
          nuevoScope.fpublicacion = {titulo: "RE: " + publicacion.titulo};
          nuevoScope.fpublicacionFormSubmitted = false;
          nuevoScope.idUsuario = true;
          nuevoScope.AgregPublicacion3 = function(isValid, id) {
              agregarPublicacion(nuevoScope, isValid, id);
          };
          ngDialog.open({ template: 'responder_Publicacion.html',
          showClose: true, closeByDocument: true, closeByEscape: true,
          scope: nuevoScope
          });
      };
      
      $scope.colapsar = function (id) {
          var element = document.getElementById('publicacion' + id);
          var boton = document.getElementById('boton' + id);
          if (element.style.display == 'none') {
              element.style.display = 'initial';
              boton.innerHTML = "<span id='up' class='glyphicon glyphicon-chevron-up'></span>";
          } else {
              element.style.display = 'none';
              boton.innerHTML = "<span id='up' class='glyphicon glyphicon-chevron-down'></span>";
          }
      };
      
      $scope.AElimPublicacion1 = function(idPublicacion) {
        //var tableFields = [["idForo","id"],["titulo","Titulo"],["fecha","Fipo"]];
        var arg = {};
        //arg[tableFields[0][1]] = ((typeof id === 'object')?JSON.stringify(id):id);
        arg['idPublicacion'] = ((typeof id === 'object')?JSON.stringify(idPublicacion):idPublicacion);
        foroService.AElimPublicacion(arg).then(function (object) {
            var msg = object.data["msg"];
            if (msg) flash(msg);
            cargarComentarios()
        });
    };
    }]);
    
socialModule.controller('VRegistroController', 
   ['$scope', 'navegador', '$location', '$route', '$timeout', 'flash', 'chatService', 'identService', 'paginasService',
    function ($scope, navegador, $location, $route, $timeout, flash, chatService, identService, paginasService) {
      $scope.msg = '';
      $scope.fUsuario = {};

      identService.VRegistro().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
      });

      navegador.agregarBotones($scope);
      
      $scope.fUsuarioSubmitted = false;
      $scope.ARegistrar0 = function(isValid) {
        $scope.fUsuarioSubmitted = true;
        if (isValid) {

          identService.ARegistrar($scope.fUsuario).then(function (object) {
              var msg = object.data["msg"];
              if (msg) {
                  flash(msg);
                  alert(msg);
              }
              var label = object.data["label"];
              $location.path(label);
              $route.reload();
          });
        }
      };

    }]);
