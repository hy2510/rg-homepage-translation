var REF = undefined
function setupRef() {
    const refData = window.sessionStorage.getItem('REF')
    REF = JSON.parse(decodeURIComponent(atob(refData)))
}
setupRef()

var ssStudyInfo = undefined
function setupStudyInfo() {
    const studyInfoStr = sessionStorage.getItem("apiStudyInfo")
    if(studyInfoStr){
        const obj = JSON.parse(studyInfoStr)
        ssStudyInfo = { ...obj }
    }
}
setupStudyInfo()

function getFERData(data, unit) {
    if(REF && REF.Mode === 'quiz' && data){
        const ferData = btoa(encodeURIComponent(JSON.stringify({
            type: 'PK',
            unit: unit || '',
            level: 'PK',
            referer: REF.referer,
            data: data
        })))
        return ferData
    }
    return undefined
}

function studyFinish(ferData) {
    window.sessionStorage.removeItem('REF')
    window.sessionStorage.removeItem('apiStudyInfo')
    
    if(ferData){
        window.sessionStorage.setItem('FER', ferData)
        window.location.replace('/rg-study-result/study-result.html')
    }else{
        onExitStudy()
    }
}

function onFinishStudyResult(code, data, unit) {
    const ferData = getFERData(data, unit)
    localStorage.setItem('Dev', data)
    studyFinish(ferData)
}

function onExitStudy() {
    if(REF && REF.referer){
        window.location.replace(REF.referer)
    }else{
        window.location.replace('/')
    }
}

function updateREF(newStudyInfo, newLevelName) {
    sessionStorage.setItem("apiStudyInfo", JSON.stringify(newStudyInfo));

    REF.StudyId = newStudyInfo.stdid
    REF.StudentHistoryId = newStudyInfo.sthid
    REF.LevelName = newLevelName
    REF.LevelRoundId = ''
    sessionStorage.setItem('REF', encodeURI(btoa(JSON.stringify(REF))))
}

function isValidateRound(round){
    const inputRound = round.toString()
    const ssStudyInfoBook = ssStudyInfo.book.toString()
    const extractRound = REF.LevelName.substring(6)
    return inputRound === ssStudyInfoBook && inputRound === extractRound
}

//------------------------------------------------------------//

const BASE_URL = '/api/study/pre-k'
function apiStudyInfo() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/info?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function apiMovieInfo() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/movie-info?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function apiQuizData(step, type) {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/dodo-quiz?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}&step=${step}&type=${type}`)
}

function apiSaveRecord(step, isStudyEnd) {
    const { StudyId, StudentHistoryId } = REF
    const record = {
        studyId: StudyId,
        studentHistoryId: StudentHistoryId,
        step: step,
        studyEndYn: isStudyEnd && isStudyEnd === 'Y' ? 'Y': 'N',
        dvc:"N"
    }
    return fetch(`${BASE_URL}/save`, {
        method: 'post',
        body: JSON.stringify(record)
    })
}

function apiGameQuizData() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/dodo-game-quiz?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function apiGameNextRound() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/dodo-game-next-round?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}