export function getSessionId(): string {

    if (typeof window === "undefined") return ""

    let id = localStorage.getItem("formaliza_session")

    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem("formaliza_session", id)
    }

    return id
}