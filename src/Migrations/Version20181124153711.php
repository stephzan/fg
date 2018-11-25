<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181124153711 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE seat (id INT AUTO_INCREMENT NOT NULL, room_id_id INT DEFAULT NULL, user_id_id INT DEFAULT NULL, position INT NOT NULL, color VARCHAR(20) DEFAULT NULL, INDEX IDX_3D5C366635F83FFC (room_id_id), INDEX IDX_3D5C36669D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C366635F83FFC FOREIGN KEY (room_id_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C36669D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519BA76ED395');
        $this->addSql('DROP INDEX UNIQ_729F519BA76ED395 ON room');
        $this->addSql('ALTER TABLE room ADD status INT NOT NULL, ADD password VARCHAR(255) DEFAULT NULL, CHANGE user_id user_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519B9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_729F519B9D86650F ON room (user_id_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE seat');
        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519B9D86650F');
        $this->addSql('DROP INDEX UNIQ_729F519B9D86650F ON room');
        $this->addSql('ALTER TABLE room ADD user_id INT NOT NULL, DROP user_id_id, DROP status, DROP password');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_729F519BA76ED395 ON room (user_id)');
    }
}
