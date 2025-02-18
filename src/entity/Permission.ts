import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({default: new Date})
    createdAt: Date

    @ManyToMany(() => Role)
    @JoinTable({name: "permissionRoles"})
    roles: Role[]
}