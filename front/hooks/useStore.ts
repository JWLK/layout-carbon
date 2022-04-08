const useStore = (key: string, object: any) => {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(object))
    } else {
        object = JSON.parse(localStorage.getItem(key)!)
    }

    return object
}
export default useStore
