export type TaskMasterContact = {
    name: string
    role: string
    mobile: string
    phone: string
};

export type TaskMasterModel = {
    guid: string
    name: string
    industry?: string
    registrationNumber?: string
    nationalId?: string
    economicNumber?: string
    headOfficeProvince?: string
    headOfficeCity?: string
    headOfficePostalCode?: string
    headOfficeAddress?: string
    headOfficePhone?: string
    factoryProvince?: string
    factoryCity?: string
    factoryPostalCode?: string
    factoryAddress?: string
    factoryPhone?: string
    contacts?: TaskMasterContact[]
    createdBy: string
    created: string
    isActive: number
    isActiveStr: string
};