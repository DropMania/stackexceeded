<script>
    import { db } from '../firebase'
    import { push } from 'svelte-spa-router'
    export let questions = []
    export let loading = true
    db.collection('question')
        .orderBy('created_at', 'desc')
        .get()
        .then((data) => {
            questions = data.docs.map((q) => {
                return { ...q.data(), id: q.id }
            })
            loading = false
        })
    export let openQuestion = (id) => {
        push(`/${id}`)
    }
</script>

<h1 class="mb-5">Questions:</h1>

{#if loading}
    <div class="text-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{/if}

<div class="container">
    {#each questions as question}
        <div class="card mb-3" on:click={openQuestion(question.id)}>
            <div class="card-body">
                <h5 class="card-title">{question.title}</h5>
            </div>
            <div class="card-footer text-muted">
                {new Date(question.created_at.seconds * 1000).toLocaleString()}
            </div>
        </div>
    {/each}
</div>
