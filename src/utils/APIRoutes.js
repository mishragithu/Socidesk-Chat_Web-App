const host = "http://localhost:5000";

module.exports = {
    host: host,
    registerRoute: `${host}/api/auth/register`,
    loginRoute: `${host}/api/auth/login`,
    setAvatarRoute: `${host}/api/auth/setAvatar`,
    allUsersRoute: `${host}/api/auth/allusers`,
    sendMessageRoute: `${host}/api/messages/addmsg`,
    getAllMessagesRoute: `${host}/api/messages/getmsg`
};
