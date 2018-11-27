<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181127142555 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE game (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, version VARCHAR(11) NOT NULL, code VARCHAR(255) NOT NULL, online TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE preference (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, lang VARCHAR(10) NOT NULL, UNIQUE INDEX UNIQ_5D69B0539D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, level INT NOT NULL, score BIGINT NOT NULL, UNIQUE INDEX UNIQ_8157AA0F9D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE room (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, game_id INT NOT NULL, name VARCHAR(255) NOT NULL, status INT NOT NULL, password VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_729F519B9D86650F (user_id_id), INDEX IDX_729F519BE48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rule (id INT AUTO_INCREMENT NOT NULL, game_id INT NOT NULL, rules JSON NOT NULL, version VARCHAR(11) NOT NULL, UNIQUE INDEX UNIQ_46D8ACCCE48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE seat (id INT AUTO_INCREMENT NOT NULL, room_id_id INT DEFAULT NULL, user_id_id INT DEFAULT NULL, position INT NOT NULL, color VARCHAR(20) DEFAULT NULL, INDEX IDX_3D5C366635F83FFC (room_id_id), UNIQUE INDEX UNIQ_3D5C36669D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, date_c DATETIME NOT NULL, date_u DATETIME NOT NULL, online TINYINT(1) NOT NULL, facebook_id VARCHAR(255) DEFAULT NULL, discord_id VARCHAR(255) DEFAULT NULL, google_id VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE preference ADD CONSTRAINT FK_5D69B0539D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0F9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519B9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519BE48FD905 FOREIGN KEY (game_id) REFERENCES game (id)');
        $this->addSql('ALTER TABLE rule ADD CONSTRAINT FK_46D8ACCCE48FD905 FOREIGN KEY (game_id) REFERENCES game (id)');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C366635F83FFC FOREIGN KEY (room_id_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C36669D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519BE48FD905');
        $this->addSql('ALTER TABLE rule DROP FOREIGN KEY FK_46D8ACCCE48FD905');
        $this->addSql('ALTER TABLE seat DROP FOREIGN KEY FK_3D5C366635F83FFC');
        $this->addSql('ALTER TABLE preference DROP FOREIGN KEY FK_5D69B0539D86650F');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0F9D86650F');
        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519B9D86650F');
        $this->addSql('ALTER TABLE seat DROP FOREIGN KEY FK_3D5C36669D86650F');
        $this->addSql('DROP TABLE game');
        $this->addSql('DROP TABLE preference');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE room');
        $this->addSql('DROP TABLE rule');
        $this->addSql('DROP TABLE seat');
        $this->addSql('DROP TABLE user');
    }
}
