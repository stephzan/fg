<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181124150103 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE seat DROP FOREIGN KEY FK_3D5C366635F83FFC');
        $this->addSql('DROP TABLE room');
        $this->addSql('DROP TABLE seat');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE room (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci, status INT NOT NULL, password VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, UNIQUE INDEX UNIQ_729F519B9D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE seat (id INT AUTO_INCREMENT NOT NULL, room_id_id INT DEFAULT NULL, user_id_id INT DEFAULT NULL, position INT NOT NULL, color VARCHAR(20) DEFAULT NULL COLLATE utf8mb4_unicode_ci, INDEX IDX_3D5C366635F83FFC (room_id_id), INDEX IDX_3D5C36669D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519B9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C366635F83FFC FOREIGN KEY (room_id_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C36669D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
    }
}
