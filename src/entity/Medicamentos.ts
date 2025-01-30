import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Medicamentos {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    descricao: string

    @Column()
    quantidade: number

    @Column()
    userId: number 

    @OneToOne(() => User) //Especifica a relação entre as entidades
    @JoinColumn() //Especifica a coluna que será usada para a junção
    user: User //Especifica a entidade que será relacionada
}