import { useEffect } from "react"

const APP_TITLE = "Verona · Pizzeria"

// Sets the browser tab title for the current page, e.g. "Menu | Verona · Pizzeria",
// and puts the app title back when the page goes away.
const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | ${APP_TITLE}`

        return () => { document.title = APP_TITLE; }
    }, [title])
}

export default useTitle
