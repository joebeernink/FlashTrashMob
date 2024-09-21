import { Guid } from 'guid-typescript';

class PartnerDocumentData {
    id: string = Guid.createEmpty().toString();

    partnerId: string = Guid.createEmpty().toString();

    name: string = '';

    url: string = '';

    createdByUserId: string = Guid.EMPTY;

    createdDate: Date = new Date();

    lastUpdatedByUserId: string = Guid.EMPTY;

    lastUpdatedDate: Date = new Date();
}

export default PartnerDocumentData;
