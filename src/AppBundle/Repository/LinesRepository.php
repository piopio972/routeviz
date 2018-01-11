<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 13.11.2017
 * Time: 15:17
 */

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

class LinesRepository extends EntityRepository
{

    public function getTrams()
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb ->select("l")
            ->from("AppBundle:Lines","l")
            ->where($qb->expr()->eq("l.type",":line"))
            ->setParameter(":line", 2);

        return $qb->getQuery()->getArrayResult();
    }

    public function getBuses()
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb ->select("l")
            ->from("AppBundle:Lines","l")
            ->where($qb->expr()->eq("l.type",":line"))
            ->setParameter(":line", 1);

        return $qb->getQuery()->getArrayResult();
    }

    public function getAll()
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb ->select("l.line")
            ->from("AppBundle:Lines","l");

        return $qb->getQuery()->getArrayResult();
    }

}