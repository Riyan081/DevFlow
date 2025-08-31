

export const DEFAULT_Empty = {
    title: "No Data Found",
    message: "Looks like database is taking a nap. Try adding some data to wake it up!",
    button:{
        text:"Add Data",
        href:"/"

    }
}


export const DEFAULT_ERROR={
    title: " Oops! Something went wrong",
    message:"Even our code can have a bad day. Give it anathor shot",
    button:{
        text:"Try Again",
        href:"/"
    }
}


export const EMPTY_QUESTION = {
    title: "No Questions Found",
    message: "Looks like no one has asked a question yet. Be the first to ask!",
    button:{
        text:"Ask Question",
        href:"/ask-question"
    }
}

export const EMPTY_TAGS = {
    title: "No Tags Found",
    message:'The tag cloud is empty. Add some keyword to make it rain',
    button:{
        text:"Add Tags",
        href:`/tags`
    }
}

export const EMPTY_COLLECTION = {
    title:"Collection Are Empty",
    message:"Your collection is looking a bit empty. Start adding items to fill it up!",
    button:{
        text:"Explore Items",
        href:"/collections"
    }
}