const constants = {
    BUILD: "build",
    DEPLOY: "deploy",
    UPLOAD: "upload",
    INSTANTIATE: "instantiate",
    INIT_SCHEMA: {
        OLD_VERSION: "init_msg",
        NEW_VERSION: "instantiate_msg"
    },
    HANDLE_SCHEMA: {
        OLD_VERSION: "handle_msg",
        NEW_VERSION: "execute_msg",
    },
    QUERY_SCHEMA: "query_msg",
    MIGRATE_SCHEMA: "migrate_msg"
}

export default constants;