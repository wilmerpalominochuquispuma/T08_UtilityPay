// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title UtilityPay - Plataforma para realizar pagos de servicios públicos utilizando moneda digital
/// @author Tu Nombre
/// @notice Este contrato permite a los usuarios registrarse, agregar fondos y realizar pagos a servicios públicos.
/// @dev Implementa pagos mediante la función transfer hacia un address del servicio público.

contract UtilityPay {
    
    /// @notice Estructura que define a los usuarios del sistema
    /// @param balance Muestra el balance del usuario
    /// @param registered Indica si el usuario está registrado
    struct User {
        uint balance;
        bool registered;
    }

    /// @notice Mapeo que almacena información de los usuarios registrados
    /// @dev Usa la dirección del usuario como clave para acceder a su balance y estado de registro
    mapping(address => User) public users;

    /// @notice Evento que se emite cuando se realiza un pago a un servicio público
    /// @param user Dirección del usuario que realizó el pago
    /// @param amount Cantidad de fondos pagados
    /// @param service Dirección del servicio público que recibió el pago
    event PaymentMade(address indexed user, uint amount, address indexed service);

    /// @notice Evento que se emite cuando un usuario agrega fondos a su cuenta
    /// @param user Dirección del usuario que agregó fondos
    /// @param amount Cantidad de fondos agregados
    event FundsAdded(address indexed user, uint amount);

    /// @notice Evento que se emite cuando un usuario intenta realizar un pago, pero no tiene suficientes fondos
    /// @param user Dirección del usuario con fondos insuficientes
    /// @param balance Balance actual del usuario
    /// @param requiredAmount Cantidad que el usuario intentó pagar
    event InsufficientFunds(address indexed user, uint balance, uint requiredAmount);

    /// @notice Verifica que el usuario esté registrado antes de ejecutar la función
    modifier onlyRegisteredUser() {
        require(users[msg.sender].registered, "Usuario no registrado");
        _;
    }

    /// @notice Registra un nuevo usuario en el sistema
    /// @dev Los usuarios solo pueden registrarse una vez
    function registerUser() public {
        require(!users[msg.sender].registered, "Usuario ya registrado");
        users[msg.sender] = User({balance: 0, registered: true});
    }

    /// @notice Permite que un usuario registrado agregue fondos a su cuenta
    /// @dev Los fondos se almacenan en el balance del usuario en el contrato
    /// @custom:require El usuario debe estar registrado
    function addFunds() public payable onlyRegisteredUser {
        users[msg.sender].balance += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    /// @notice Realiza un pago a un servicio público
    /// @dev El pago se envía al address del servicio utilizando la función transfer
    /// @param _amount La cantidad de fondos que se va a pagar
    /// @param _service Dirección del servicio público que recibirá el pago
    /// @custom:require El usuario debe tener fondos suficientes para cubrir el pago
    /// @custom:require El usuario debe estar registrado
    function payService(uint _amount, address _service) public onlyRegisteredUser {
        User storage user = users[msg.sender];

        // Verificar si el usuario tiene suficientes fondos
        if (user.balance >= _amount) {
            user.balance -= _amount;
            
            // Enviar el pago al servicio
            payable(_service).transfer(_amount);

            emit PaymentMade(msg.sender, _amount, _service);
        } else {
            emit InsufficientFunds(msg.sender, user.balance, _amount);
        }
    }

    /// @notice Consulta el balance de un usuario registrado
    /// @dev Solo usuarios registrados pueden consultar su balance
    /// @return El balance actual del usuario
    function checkBalance() public view onlyRegisteredUser returns (uint) {
        return users[msg.sender].balance;
    }
}
