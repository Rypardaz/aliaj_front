import { getIdentityUrl, getServiceUrl, getUserManagementUrl } from 'src/environment/environment';
import { HttpService } from './http.service';
import { createGuid } from '../framework-components/constants';
import { Inject } from '@angular/core';
declare var $: any

export class ServiceBase {

    baseUrl;

    constructor(private readonly controllerName: string,
        readonly httpService: HttpService,
        @Inject(String) service = '') {
        switch (service) {
            case 'sso':
                this.baseUrl = `${getIdentityUrl()}${this.controllerName}`;
                break;
            case 'um':
                this.baseUrl = `${getUserManagementUrl()}${this.controllerName}`;
                break;
            default:
                this.baseUrl = `${getServiceUrl()}${this.controllerName}`;
                break;
        }
    }

    create<T>(body: any) {
        const path = `${this.baseUrl}/Create`;
        return this.httpService.post<T>(path, body);
    }

    batchCreate(body: any) {
        const path = `${this.baseUrl}/BatchCreate`;
        return this.httpService.post(path, body);
    }

    createWithFile<T>(formData: any) {
        const path = `${this.baseUrl}/Create`;
        return this.httpService.postFormData<T>(path, formData);
    }

    edit(body: any) {
        const path = `${this.baseUrl}/Edit`;
        return this.httpService.post(path, body);
    }

    editWithFile(formData: any) {
        const path = `${this.baseUrl}/Edit`;
        return this.httpService.postFormData<any>(path, formData);
    }

    delete(id: string | number) {
        const path = `${this.baseUrl}/Delete/${id}`;
        return this.httpService.post(path);
    }

    remove(id: string | number) {
        const path = `${this.baseUrl}/Remove/${id}`;
        return this.httpService.post(path, true, true);
    }

    restore(id: string | number) {
        const path = `${this.baseUrl}/Restore/${id}`;
        return this.httpService.post(path, true, true);
    }

    lock(id: string | number) {
        const path = `${this.baseUrl}/Lock/${id}`;
        return this.httpService.post(path, true, true);
    }

    unlock(id: string | number) {
        const path = `${this.baseUrl}/Unlock/${id}`;
        return this.httpService.post(path, true, true);
    }

    activate(id: string | number) {
        const path = `${this.baseUrl}/Activate/${id}`;
        return this.httpService.post(path, {}, true, true);
    }

    deactivate(id: string | number) {
        const path = `${this.baseUrl}/Deactivate/${id}`;
        return this.httpService.post(path, {}, true, true);
    }

    getBy<T>(id: string | number) {
        const path = `${this.baseUrl}/GetBy`;
        return this.httpService.get<T>(path, id);
    }

    getForEdit<T>(id: string | number) {
        const path = `${this.baseUrl}/GetForEdit`;
        return this.httpService.get<T>(path, id);
    }

    getList<T>() {
        let path = `${this.baseUrl}/GetList`;
        return this.httpService.getAll<T>(path);
    }

    getListBy(condition: any, loading: boolean = false) {
        let path = `${this.baseUrl}/GetList/${condition}`;
        return this.httpService.getAll<any>(path, loading);
    }

    getListWithParams(actionName: string, params: any, loading: boolean = false) {
        let path = `${this.baseUrl}/${actionName}`;
        return this.httpService.getWithParams<any>(path, loading, params);
    }

    getForCombo<T>(param: string = undefined) {
        let path = `${this.baseUrl}/GetForCombo/`;
        if (param) {
            path += `${param}`;
        }

        return this.httpService.getAll<T>(path);
    }

    getForComboBy<T>(params: any) {
        const path = `${this.baseUrl}/GetForCombo`;
        return this.httpService.getWithParams<T>(path, params);
    }

    download(token, searchModel, action, fileName) {
        fetch(`${this.baseUrl}/${action}?` + new URLSearchParams(searchModel),
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(resp => {
                return resp.blob()
            })
            .then(blob => {
                if (blob.size == 0) return;

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.id = `file-${createGuid()}`
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                $(`#${a.id}`).remove();
            }).catch(() => { });
    }
}