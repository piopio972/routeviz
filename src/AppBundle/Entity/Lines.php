<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Lines
 *
 * @ORM\Table(name="`Lines`", uniqueConstraints={@ORM\UniqueConstraint(name="line_UNIQUE", columns={"line"})}, indexes={@ORM\Index(name="fk_Lines_Type1_idx", columns={"type_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\LinesRepository")
 */
class Lines
{
    /**
     * @var string
     *
     * @ORM\Column(name="line", type="string", length=45, nullable=false)
     */
    private $line;

    /**
     * @var integer
     *
     * @ORM\Column(name="line_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $lineId;

    /**
     * @var \AppBundle\Entity\Type
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Type")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="type_id", referencedColumnName="type_id")
     * })
     */
    private $type;



    /**
     * Set line
     *
     * @param string $line
     *
     * @return Lines
     */
    public function setLine($line)
    {
        $this->line = $line;

        return $this;
    }

    /**
     * Get line
     *
     * @return string
     */
    public function getLine()
    {
        return $this->line;
    }

    /**
     * Get lineId
     *
     * @return integer
     */
    public function getLineId()
    {
        return $this->lineId;
    }

    /**
     * Set type
     *
     * @param \AppBundle\Entity\Type $type
     *
     * @return Lines
     */
    public function setType(\AppBundle\Entity\Type $type = null)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return \AppBundle\Entity\Type
     */
    public function getType()
    {
        return $this->type;
    }
}
