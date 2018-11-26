<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181125103533 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE game_rules DROP FOREIGN KEY FK_BBA9E0B34D77E7D8');
        $this->addSql('DROP TABLE game');
        $this->addSql('DROP TABLE game_rules');
        $this->addSql('ALTER TABLE room DROP game_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE game (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci, code VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci, version VARCHAR(11) NOT NULL COLLATE utf8mb4_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_rules (id INT AUTO_INCREMENT NOT NULL, game_id_id INT NOT NULL, rules JSON NOT NULL, version VARCHAR(11) NOT NULL COLLATE utf8mb4_unicode_ci, UNIQUE INDEX UNIQ_BBA9E0B34D77E7D8 (game_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game_rules ADD CONSTRAINT FK_BBA9E0B34D77E7D8 FOREIGN KEY (game_id_id) REFERENCES game (id)');
        $this->addSql('ALTER TABLE room ADD game_id INT NOT NULL');
    }
}
