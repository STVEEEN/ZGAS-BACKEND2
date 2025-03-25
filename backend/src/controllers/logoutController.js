const logoutController = {};

logoutController.logout = async (req, res) => {
    //BORRAR LA COOKIE DE AUTHTOKEN

    res.clearCookie("authToken");

    return res.json ({message: "Sesion cerrada"});
}

export default logoutController;