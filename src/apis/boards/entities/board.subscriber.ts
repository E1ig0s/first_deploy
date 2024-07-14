// import {
//     DataSource,
//     EntitySubscriberInterface,
//     EventSubscriber,
//     InsertEvent,
// } from 'typeorm';
// import { Board } from './board.entity';

// @EventSubscriber()
// export class BoardSubscriber implements EntitySubscriberInterface {
//     constructor(dataSource: DataSource) {
//         dataSource.subscribers.push(this);
//     }

//     listenTo() {
//         return Board;
//     }

//     afterInsert(event: InsertEvent<any>): Promise<any> | void {
//         const { number, writer, title, contents, createdAt } = event.entity;

//         console.log(number, writer, title, contents, createdAt);
//     }
// }
