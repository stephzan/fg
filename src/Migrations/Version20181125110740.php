<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181125110740 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE room ADD game_id INT NOT NULL');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519BE48FD905 FOREIGN KEY (game_id) REFERENCES game (id)');
        $this->addSql('CREATE INDEX IDX_729F519BE48FD905 ON room (game_id)');
        $this->addSql('ALTER TABLE seat DROP INDEX IDX_3D5C36669D86650F, ADD UNIQUE INDEX UNIQ_3D5C36669D86650F (user_id_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519BE48FD905');
        $this->addSql('DROP INDEX IDX_729F519BE48FD905 ON room');
        $this->addSql('ALTER TABLE room DROP game_id');
        $this->addSql('ALTER TABLE seat DROP INDEX UNIQ_3D5C36669D86650F, ADD INDEX IDX_3D5C36669D86650F (user_id_id)');
    }
}
