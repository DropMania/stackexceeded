<script>
    import { db, firebase } from '../firebase'
    import store from '../store'
    import { push } from 'svelte-spa-router'

    export let tags = []
    export let formValues = {
        title: '',
        content: '',
        tags: [],
    }
    export let formEmpty = false
    export let emptyTextTitle = 'The following fields are empty:'
    export let emptyTextContent = ''
    export let submitting = false

    db.collection('tags')
        .get()
        .then((data) => {
            tags = data.docs.map((t) => t.data().text)
        })
    export let submit = async (event) => {
        event.preventDefault()
        formValues.tags = formValues.tags.filter((t) => t != '')
        let empty = []
        if (formValues.title == '') {
            empty.push('Title')
        }
        if (formValues.content == '') {
            empty.push('Content')
        }
        if (formValues.tags.length == 0) {
            empty.push('Tags')
        }
        if (empty.length) {
            formEmpty = true
            emptyTextContent = empty.join(', ')
        } else {
            submitting = true
            formEmpty = false
            await db
                .collection('question')
                .doc()
                .set({
                    ...formValues,
                    user_id: $store.user.uid,
                    created_at: firebase.firestore.FieldValue.serverTimestamp(),
                })
            push('/')
            submitting = false
        }
    }
</script>

<h1>Ask Question:</h1>
{#if formEmpty}
    <div class="alert alert-dismissible alert-danger">
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            on:click={() => {
                formEmpty = false
            }}
        />
        <strong>{emptyTextTitle}</strong><br />
        {emptyTextContent}
    </div>
{/if}

<form>
    <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
            bind:value={formValues.title}
            type="text"
            class="form-control text-light"
            id="title"
        />
        <div class="form-text">What do you want to know?</div>
    </div>
    <div class="mb-3">
        <label for="content" class="form-label">Describe you Question:</label>
        <textarea
            class="form-control text-light"
            bind:value={formValues.content}
            id="content"
            rows="3"
        />
    </div>
    <select
        class="form-select text-light"
        multiple
        bind:value={formValues.tags}
    >
        {#each tags as tag}
            <option value={tag}>{tag}</option>
        {/each}
    </select>
    <button on:click={submit} type="submit" class="btn btn-primary">
        {#if submitting}
            <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
            />
        {/if}
        Submit</button
    >
</form>
