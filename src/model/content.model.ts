export class Content {
    constructor(
        readonly idContent: string,
        readonly contentType: string,
        readonly title: string,
        readonly description: string,
        readonly insertDate: string,
        readonly sharePosition: boolean,
        readonly positionLatitude: number,
        readonly positionLongitude: number,
        readonly shareName: boolean,
    ) {}
  }