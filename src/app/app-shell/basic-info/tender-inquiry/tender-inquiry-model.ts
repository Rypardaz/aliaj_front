export type TenderInquiryModel = {
    guid: string
}

export type TenderInquiryCommand = {
    guid: string
    projectCode: string
    saleDepartmentGuid: string
    taskMasterGuid: string
    applicationTypeGuid: string
    projectTypeGuid: string
    description: string
    no: string
    documentReceivedDate: string
    submissionDeadline: string
    guaranteeReceivedDate: string
    inquirySentDate: string
    quotedAmount: number | null
    inquiryResultGuid: string | null
    lossReasonGuid: string | null
    winner: string
    winningAmount: number | null
}
