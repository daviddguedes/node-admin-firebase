angular.module('adminFirebase', [])

    .config(function () {

        // Por favor modificar estas credenciais plas do seu app :-)
        var config = {
            apiKey: "AIzaSyC4l_WS5sjLmbad4fTuDsyGed3bO07PCxs",
            authDomain: "admin-firebase.firebaseapp.com",
            databaseURL: "https://admin-firebase.firebaseio.com",
            storageBucket: "admin-firebase.appspot.com",
            messagingSenderId: "785070066612"
        };
        firebase.initializeApp(config);
        
    })

    .controller('MainCtrl', function ($scope, $http) {
        $scope.usuarios = [];

        var usuariosRef = firebase.database().ref('usuarios');
        usuariosRef.on('value', function (snapshot) {
            $scope.usuarios = [];
            var users = snapshot.val();
            var array = $.map(users, function (value, index) {
                $scope.usuarios.push({
                    "id": index,
                    "email": value.email,
                    "date": value.created_at
                });
            });

            $scope.$apply();

        });

        $scope.deleteUser = function (user) {
            $http.post('/delete', user).then(function (response) {
                console.log('Usuário deletado com sucesso!');
            }, function (error) {
                console.log('Houve algum erro: ' + error);
            });
        }
    });