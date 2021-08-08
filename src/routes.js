import Home from './components/Home.svelte'
import NotFound from './components/NotFound.svelte'
import Ask from './components/Ask.svelte'
import Question from './components/Question.svelte'
export default {
    '/': Home,
    '/ask': Ask,
    '/:id': Question,
    '*': NotFound,
}
