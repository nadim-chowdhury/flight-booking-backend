import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airline: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column('decimal')
  price: number;

  @Column()
  duration: string;
}

// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class Flight {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   airline: string;

//   @Column()
//   departureTime: Date;

//   @Column()
//   arrivalTime: Date;

//   @Column()
//   from: string;

//   @Column()
//   to: string;

//   @Column()
//   price: number;

//   @Column()
//   seatsAvailable: number;
// }
