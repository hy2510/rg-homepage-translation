var REF = undefined
function setupRef() {
    const refData = window.sessionStorage.getItem('REF')
    REF = JSON.parse(decodeURIComponent(atob(refData)))
}
setupRef()

const BASE_URL = '/api/study/level-test'
function getLevelTestInfo(level) {
    return fetch(`${BASE_URL}/info?level=${level}`)
}

function deleteTest(levelTestId) {
    return fetch(`${BASE_URL}/reset?levelTestId=${levelTestId}`, {method: 'DELETE'})
}

function getQuizData(levelTestDetailId) {
    return fetch(`${BASE_URL}/quiz?levelTestDetailId=${levelTestDetailId}`)
}

function saveRecord(saveData) {
    return fetch(`${BASE_URL}/save`, {
        method: 'post',
        body: JSON.stringify(saveData)
    })
}

function getTestResult(levelTestDetailId) {
    return fetch(`${BASE_URL}/result?levelTestDetailId=${levelTestDetailId}`)
}