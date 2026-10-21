import { useEffect } from "react"

const APP_TITLE = "Verona · Pizzeria"

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | ${APP_TITLE}`

        return () => { document.title = APP_TITLE; }
    }, [title])
}

export default useTitle
