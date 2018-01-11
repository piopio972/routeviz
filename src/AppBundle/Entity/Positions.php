<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Positions
 *
 * @ORM\Table(name="Positions", indexes={@ORM\Index(name="fk_Positions_Lines_idx", columns={"line_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PositionsRepository")
 */
class Positions
{
    /**
     * @var string
     *
     * @ORM\Column(name="course", type="string", length=45, nullable=false)
     */
    private $course;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=45, nullable=false)
     */
    private $code;

    /**
     * @var float
     *
     * @ORM\Column(name="latitude", type="decimal", precision=10, scale=8, nullable=false)
     */
    private $latitude;

    /**
     * @var float
     *
     * @ORM\Column(name="longitude", type="decimal", precision=11, scale=8, nullable=false)
     */
    private $longitude;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="timestamp", type="datetime", nullable=false)
     */
    private $timestamp;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \AppBundle\Entity\Lines
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Lines")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="line_id", referencedColumnName="line_id")
     * })
     */
    private $line;



    /**
     * Set course
     *
     * @param string $course
     *
     * @return Positions
     */
    public function setCourse($course)
    {
        $this->course = $course;

        return $this;
    }

    /**
     * Get course
     *
     * @return string
     */
    public function getCourse()
    {
        return $this->course;
    }

    /**
     * Set code
     *
     * @param string $code
     *
     * @return Positions
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set latitude
     *
     * @param string $latitude
     *
     * @return Positions
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return float
     */
    public function getLatitude()
    {
        return floatval($this->latitude);
    }

    /**
     * Set longitude
     *
     * @param string $longitude
     *
     * @return Positions
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return float
     */
    public function getLongitude()
    {
        return (float)$this->longitude;
    }

    /**
     * Set timestamp
     *
     * @param \DateTime $timestamp
     *
     * @return Positions
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set line
     *
     * @param \AppBundle\Entity\Lines $line
     *
     * @return Positions
     */
    public function setLine(\AppBundle\Entity\Lines $line = null)
    {
        $this->line = $line;

        return $this;
    }

    /**
     * Get line
     *
     * @return \AppBundle\Entity\Lines
     */
    public function getLine()
    {
        return $this->line;
    }
}
