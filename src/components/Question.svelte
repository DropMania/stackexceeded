<script>
    import { db, firebase } from '../firebase'
    import store from '../store'
    export let params = {}
    export let question = {
        title: '',
        content: '',
        user_id: '',
        tags: [],
        created_at: '',
    }
    export let user = {
        name: '',
    }
    export let progessPercent = 0
    export let answer = ''
    export let answerEmpty = false
    export let answers = []
    export let firstLoaded = false
    export let submitting = false
    let loadData = async () => {
        let doc = await db.collection('question').doc(params.id).get()
        question = doc.data()
        progessPercent = 33
        let userDoc = await db.collection('user').doc(question.user_id).get()
        progessPercent = 66
        user = userDoc.data()
        let answerDocs = await db
            .collection('answer')
            .where('question_id', '==', params.id)
            .orderBy('created_at', 'asc')
            .get()
        progessPercent = 100
        answers = answerDocs.docs.map((a) => ({ ...a.data(), user: {} }))
        answers.forEach(async (ans, idx) => {
            let userDoc = await db.collection('user').doc(ans.user_id).get()
            answers[idx] = { ...answers[idx], user: userDoc.data() }
        })
        submitting = false
        firstLoaded = true
    }

    export let submit = async (evt) => {
        if (!submitting) {
            if (answer == '') {
                answerEmpty = true
            } else {
                submitting = true
                let tempAns = answer
                answer = ''
                await db.collection('answer').doc().set({
                    answer: tempAns,
                    user_id: $store.user.uid,
                    question_id: params.id,
                    created_at: firebase.firestore.FieldValue.serverTimestamp(),
                })

                loadData()
            }
        }
    }
    loadData()
</script>

{#if !firstLoaded}
    <div class="progress" style="height: 3px; ">
        <div
            class="progress-bar bg-info"
            role="progressbar"
            style="width: {progessPercent}%"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
        />
    </div>
{:else}
    <div class="card">
        <div class="card-header">
            {#if question.created_at != ''}
                {question.created_at.toDate().toDateString()}
            {/if}
        </div>
        <div class="card-body">
            <h1 class="card-title fs-1">{question.title}</h1>
            <p class="card-text fs-4">{question.content}</p>
        </div>
    </div>
    {#if answers.length == 0}
        <h3 class="mt-4">There are no answers yet :(</h3>
    {:else}
        <h3 class="mt-4">Answers:</h3>
    {/if}
    <div class="mb-5">
        {#each answers as answerResult}
            <div class="card mb-3">
                <div class="card-header">
                    {new Date(
                        answerResult.created_at.seconds * 1000
                    ).toLocaleString()}
                </div>
                <div class="card-body">
                    <p class="card-text fs-4">{answerResult.answer}</p>
                    {answerResult.user.name}
                </div>
            </div>
        {/each}
    </div>

    {#if answerEmpty}
        <div class="alert alert-dismissible alert-danger">
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                on:click={() => {
                    answerEmpty = false
                }}
            />
            <strong>Your answer is empty</strong>
        </div>
    {/if}
    <form on:submit|preventDefault={submit}>
        <div class="mb-3">
            <label for="content" class="form-label"
                >Do you know the answer?:</label
            >
            <textarea
                class="form-control text-light"
                bind:value={answer}
                id="content"
                rows="3"
            />
        </div>
        <button type="submit" class="btn btn-primary">
            {#if submitting}
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                />
            {/if}
            Submit
        </button>
    </form>
{/if}
