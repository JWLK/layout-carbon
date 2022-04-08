const fetchStore = (key: string) => JSON.parse(localStorage.getItem(key)!)

// localStorage.setItem(key, JSON.stringify(object))
// localStorage.removeItem(key)
export default fetchStore
