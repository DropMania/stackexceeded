<script>
    import { firebase, db } from './firebase'
    import store from './store'
    import { default as Router, push } from 'svelte-spa-router'
    import routes from './routes'

    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            store.set({ ...store, user, loggedIn: true })
            console.log(store)
        } else {
            store.set({ ...store, user: {}, loggedIn: false })
        }
    })

    export let login = () => {
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                let { user } = result
                db.collection('user').doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    export let logout = () => {
        firebase.auth().signOut()
    }

    export let askQuestion = () => {
        push('/ask')
    }
</script>

<main>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">StackExceeded</a>
            <button class="d-flex btn btn-info" on:click={askQuestion}>
                Ask Question
            </button>
            {#if !$store.loggedIn}
                <button class="d-flex btn btn-primary" on:click={login}>
                    Login
                </button>
            {:else}
                <div class="d-flex">
                    <button class="d-flex btn btn-primary " on:click={logout}>
                        Logout
                    </button>
                    <img
                        src={$store.user.photoURL}
                        alt="Avatar"
                        class="avatar ms-3"
                    />
                </div>
            {/if}
        </div>
    </nav>
    <div class="container mt-4">
        <Router {routes} />
    </div>
</main>

<style>
    html,
    body,
    main,
    nav {
        margin: 0px;
        padding: 0px;
    }

    .avatar {
        border-radius: 50%;
        height: 3em;
    }
</style>
