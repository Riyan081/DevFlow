const ROUTES = {
    HOME:"/",
    SIGN_IN:"/sign-in",
    SIGN_UP:"/sign-up",
    ASK_QUESTION:"/ask-question",
    QUESTION:(_id:string)=> `/questions/${_id}`,
}

export default ROUTES;