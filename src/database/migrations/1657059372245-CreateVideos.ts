import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVideos1657059372245 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'video',
                columns: [
                    {
                        name: 'id_video',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                    },
                    {
                        name: 'id_category',
                        type: 'int',
                    },
                    {
                        name: 'duration',
                        type: 'decimal',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_video_category',
                        columnNames: ['id_category'],
                        referencedTableName: 'category',
                        referencedColumnNames: ['id_category'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('video');
    }
}
