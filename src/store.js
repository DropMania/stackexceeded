import {writable} from 'svelte/store'

export default writable({
    user: {},
    loggedIn: false
})